-- Create table for saved LeetCode profiles
CREATE TABLE public.saved_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leetcode_username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, leetcode_username)
);

-- Enable Row Level Security
ALTER TABLE public.saved_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved profiles" 
ON public.saved_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved profiles" 
ON public.saved_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved profiles" 
ON public.saved_profiles 
FOR DELETE 
USING (auth.uid() = user_id);