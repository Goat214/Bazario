import { supabase } from '../lib/supabase'

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export const updateProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}