import { supabase } from '../lib/supabase'

export const getProducts = async (filters = {}) => {
  let query = supabase
    .from('products')
    .select('*, product_images(url, sort_order)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters.category && filters.category !== 'Баары')
    query = query.eq('category_id', filters.category)
  if (filters.city && filters.city !== 'Баары')
    query = query.eq('location', filters.city)
  if (filters.condition && filters.condition !== 'all')
    query = query.eq('condition', filters.condition)
  if (filters.max_price)
    query = query.lte('price', filters.max_price)
  if (filters.search)
    query = query.ilike('title', `%${filters.search}%`)

  const { data, error } = await query
  if (error) throw error
  return data
}

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(url, sort_order), profiles(full_name, avatar_url, phone, city, created_at)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export const getSimilarProducts = async (id, limit = 4) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(url, sort_order)')
    .neq('id', id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export const uploadProductImage = async (userId, productId, file, index) => {
  const fileName = `${userId}/${productId}/${Date.now()}_${index}`
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file)
  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  await supabase.from('product_images').insert({
    product_id: productId,
    url: publicUrl,
    sort_order: index
  })
  return publicUrl
}