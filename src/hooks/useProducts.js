import { useState, useEffect } from 'react'
import { getProducts } from '../services/productService'

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filterKey = JSON.stringify(filters)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await getProducts(filters)
        setProducts(filters.limit ? data.slice(0, filters.limit) : data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [filterKey])

  return { products, loading, error }
}