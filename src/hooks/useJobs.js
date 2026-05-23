import { useState, useEffect } from 'react'
import { getJobs } from '../services/jobService'

export const useJobs = (filters = {}) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filterKey = JSON.stringify(filters)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await getJobs(filters)
        setJobs(filters.limit ? data.slice(0, filters.limit) : data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [filterKey])

  return { jobs, loading, error }
}