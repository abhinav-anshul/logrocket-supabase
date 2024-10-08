"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from "@/styles/Edit.module.css"
import { supabase } from "@/utils/supabase"

const Edit = () => {
  const [workout, setWorkout] = useState(null)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  console.log({ id })

  useEffect(() => {
    // Fetch the user
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user)
    }

    fetchUser()
  }, [])

  console.log({ user })

  useEffect(() => {
    const getWorkout = async () => {
      if (!id) return

      const { data } = await supabase.from("workouts").select("*").filter("id", "eq", id).single()
      setWorkout(data)
    }
    getWorkout()
  }, [id])

  const handleOnChange = (e) => {
    setWorkout({
      ...workout,
      [e.target.name]: e.target.value,
    })
  }

  const updateWorkout = async () => {
    const { title, loads, reps } = workout
    if (!user) {
      alert("User not authenticated")
      return
    }

    const { data } = await supabase
      .from("workouts")
      .update({
        title,
        loads,
        reps,
      })
      .eq("id", id)
      .eq("user_id", user.id)

    alert("Workout updated successfully")

    router.push("/")
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Edit Workout</h1>
        <label className={styles.label}>Title:</label>
        <input
          type="text"
          name="title"
          value={workout?.title}
          onChange={handleOnChange}
          className={styles.updateInput}
        />
        <label className={styles.label}>Load (kg):</label>
        <input
          type="text"
          name="loads"
          value={workout?.loads}
          onChange={handleOnChange}
          className={styles.updateInput}
        />
        <label className={styles.label}>Reps:</label>
        <input
          type="text"
          name="reps"
          value={workout?.reps}
          onChange={handleOnChange}
          className={styles.updateInput}
        />

        <button onClick={updateWorkout} className={styles.updateButton}>
          Update Workout
        </button>
      </div>
    </div>
  )
}

export default Edit
