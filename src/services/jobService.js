import { supabase } from '../lib/supabase'

export const getJobs = async (filters = {}) => {
  let query = supabase
    .from('jobs')
    .select('*, profiles(full_name, avatar_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters.category && filters.category !== 'Баары')
    query = query.eq('category_id', filters.category)
  if (filters.city && filters.city !== 'Баары')
    query = query.eq('location', filters.city)
  if (filters.job_type && filters.job_type !== 'all')
    query = query.eq('job_type', filters.job_type)
  if (filters.salary_min)
    query = query.gte('salary_min', filters.salary_min)
  if (filters.search)
    query = query.ilike('title', `%${filters.search}%`)

  const { data, error } = await query
  if (error) throw error
  return data
}

export const getJobById = async (id) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, profiles(full_name, avatar_url, phone, city)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export const getSimilarJobs = async (id, limit = 3) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .neq('id', id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export const createJob = async (jobData) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert(jobData)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteJob = async (id) => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export const applyJob = async (jobId, userId, coverLetter) => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      job_id: jobId,
      applicant_id: userId,
      cover_letter: coverLetter,
      status: 'pending'
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export const checkApplied = async (jobId, userId) => {
  const { data } = await supabase
    .from('job_applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('applicant_id', userId)
    .single()
  return !!data
}