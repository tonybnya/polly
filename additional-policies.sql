-- Additional RLS policies needed for the polling app
-- Run this in your Supabase SQL Editor after the main schema

-- Add missing policies for polls table
CREATE POLICY "update own polls" ON public.polls
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "delete own polls" ON public.polls
    FOR DELETE USING (auth.uid() = created_by);

-- Add missing policies for poll_options table
CREATE POLICY "update options for own poll" ON public.poll_options
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.polls p
            WHERE p.id = poll_options.poll_id AND p.created_by = auth.uid()
        )
    );

CREATE POLICY "delete options for own poll" ON public.poll_options
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.polls p
            WHERE p.id = poll_options.poll_id AND p.created_by = auth.uid()
        )
    );

-- Add missing policies for votes table
CREATE POLICY "update own vote" ON public.votes
    FOR UPDATE USING (auth.uid() = voter_id);

CREATE POLICY "delete own vote" ON public.votes
    FOR DELETE USING (auth.uid() = voter_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.polls TO anon, authenticated;
GRANT ALL ON public.poll_options TO anon, authenticated;
GRANT ALL ON public.votes TO anon, authenticated;
