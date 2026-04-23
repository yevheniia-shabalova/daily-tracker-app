'use client'

import React, { useState, useEffect } from 'react'
import type { Tracker, TrackerCategory } from '@daily-tracker/core'
import { useHabits } from './habits-context'

interface HabitFormProps {
  habit?: Tracker
  onClose: () => void
}

export function HabitForm({ habit, onClose }: HabitFormProps) {
  const { categories, addHabit, updateHabit, deleteHabit } = useHabits()
  const [formData, setFormData] = useState({
    name: '',
    category: 'Health' as TrackerCategory,
    unit: '',
    targetPerDay: 1,
  })

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        category: habit.category,
        unit: habit.unit,
        targetPerDay: habit.targetPerDay,
      })
    }
  }, [habit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.unit.trim()) {
      alert('Please fill in all required fields')
      return
    }

    if (habit) {
      updateHabit(habit.id, formData)
    } else {
      addHabit(formData)
    }

    onClose()
  }

  const handleDelete = () => {
    if (habit && confirm(`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`)) {
      deleteHabit(habit.id)
      onClose()
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
          Habit Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Drink Water"
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '16px',
            background: 'var(--surface)',
            color: 'var(--text)',
          }}
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
          Category *
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value as TrackerCategory)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '16px',
            background: 'var(--surface)',
            color: 'var(--text)',
          }}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Unit *
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            placeholder="e.g., glasses"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '16px',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Target per Day *
          </label>
          <input
            type="number"
            value={formData.targetPerDay}
            onChange={(e) => handleChange('targetPerDay', parseInt(e.target.value) || 1)}
            min="1"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '16px',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '20px' }}>
        <div>
          {habit && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: '12px 24px',
                border: '1px solid #dc3545',
                borderRadius: '8px',
                background: '#dc3545',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#c82333'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc3545'
              }}
            >
              Delete Habit
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 24px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--surface)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              background: 'var(--primary)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
            }}
          >
            {habit ? 'Update Habit' : 'Add Habit'}
          </button>
        </div>
      </div>
    </form>
  )
}