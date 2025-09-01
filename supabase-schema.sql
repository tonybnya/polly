-- Supabase Database Schema for Polling App
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create polls table
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create poll options table
CREATE TABLE IF NOT EXISTS public.poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES auth.users(id),
    voter_ip INET, -- For anonymous voting
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (poll_id, COALESCE(voter_id, voter_ip)) -- One vote per user/IP per poll
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_polls_created_by ON public.polls(created_by);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON public.votes(option_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for polls table
CREATE POLICY "Anyone can view polls" ON public.polls
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own polls" ON public.polls
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own polls" ON public.polls
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own polls" ON public.polls
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for poll_options table
CREATE POLICY "Anyone can view poll options" ON public.poll_options
    FOR SELECT USING (true);

CREATE POLICY "Poll creators can add options" ON public.poll_options
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.polls p
            WHERE p.id = poll_options.poll_id AND p.created_by = auth.uid()
        )
    );

CREATE POLICY "Poll creators can update options" ON public.poll_options
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.polls p
            WHERE p.id = poll_options.poll_id AND p.created_by = auth.uid()
        )
    );

CREATE POLICY "Poll creators can delete options" ON public.poll_options
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.polls p
            WHERE p.id = poll_options.poll_id AND p.created_by = auth.uid()
        )
    );

-- RLS Policies for votes table
CREATE POLICY "Anyone can view votes" ON public.votes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can vote (authenticated or anonymous)" ON public.votes
    FOR INSERT WITH CHECK (
        (auth.uid() IS NOT NULL AND voter_id = auth.uid()) OR
        (auth.uid() IS NULL AND voter_ip IS NOT NULL)
    );

CREATE POLICY "Users can update their own votes" ON public.votes
    FOR UPDATE USING (
        (auth.uid() IS NOT NULL AND voter_id = auth.uid()) OR
        (auth.uid() IS NULL AND voter_ip IS NOT NULL)
    );

CREATE POLICY "Users can delete their own votes" ON public.votes
    FOR DELETE USING (
        (auth.uid() IS NOT NULL AND voter_id = auth.uid()) OR
        (auth.uid() IS NULL AND voter_ip IS NOT NULL)
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_polls_updated_at 
    BEFORE UPDATE ON public.polls 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get poll results with vote counts
CREATE OR REPLACE FUNCTION get_poll_results(poll_uuid UUID)
RETURNS TABLE (
    option_id UUID,
    option_text TEXT,
    position INTEGER,
    vote_count BIGINT,
    percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        po.id as option_id,
        po.text as option_text,
        po.position,
        COUNT(v.id) as vote_count,
        CASE 
            WHEN (SELECT COUNT(*) FROM public.votes WHERE poll_id = poll_uuid) = 0 THEN 0
            ELSE ROUND(
                (COUNT(v.id)::NUMERIC / (SELECT COUNT(*) FROM public.votes WHERE poll_id = poll_uuid)::NUMERIC) * 100, 
                2
            )
        END as percentage
    FROM public.poll_options po
    LEFT JOIN public.votes v ON po.id = v.option_id
    WHERE po.poll_id = poll_uuid
    GROUP BY po.id, po.text, po.position
    ORDER BY po.position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.polls TO anon, authenticated;
GRANT ALL ON public.poll_options TO anon, authenticated;
GRANT ALL ON public.votes TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_poll_results(UUID) TO anon, authenticated;
