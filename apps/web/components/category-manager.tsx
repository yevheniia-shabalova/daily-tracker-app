'use client'

import React, { useState } from 'react'
import type { TrackerCategory } from '@daily-tracker/core'
import { useHabits } from './habits-context'

export function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory, habits } = useHabits()
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState<TrackerCategory | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim() as TrackerCategory)) {
      addCategory(newCategory.trim() as TrackerCategory)
      setNewCategory('')
    }
  }

  const handleStartEdit = (category: TrackerCategory) => {
    setEditingCategory(category)
    setEditValue(category)
  }

  const handleSaveEdit = () => {
    if (editingCategory && editValue.trim() && editValue !== editingCategory) {
      updateCategory(editingCategory, editValue.trim() as TrackerCategory)
      setEditingCategory(null)
      setEditValue('')
    }
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setEditValue('')
  }

  const handleDeleteCategory = (category: TrackerCategory) => {
    const habitsInCategory = habits.filter(h => h.category === category).length
    if (habitsInCategory > 0) {
      alert(`Cannot delete category "${category}" because it contains ${habitsInCategory} habit(s). Please reassign or delete those habits first.`)
      return
    }

    if (confirm(`Are you sure you want to delete the category "${category}"?`)) {
      deleteCategory(category)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem' }}>Add New Category</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '16px',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
            style={{
              padding: '12px 16px',
              border: 'none',
              borderRadius: '8px',
              background: 'var(--primary)',
              color: 'white',
              cursor: newCategory.trim() ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              opacity: newCategory.trim() ? 1 : 0.5,
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem' }}>Existing Categories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map(category => {
            const habitsCount = habits.filter(h => h.category === category).length

            return (
              <div
                key={category}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: 'var(--surface-2)',
                  borderRadius: '8px',
                }}
              >
                {editingCategory === category ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        fontSize: '16px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      style={{
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        background: 'var(--primary)',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontWeight: '500' }}>{category}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '14px' }}>
                      {habitsCount} habit{habitsCount !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => handleStartEdit(category)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      disabled={habitsCount > 0}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        background: habitsCount > 0 ? '#ccc' : '#dc3545',
                        color: 'white',
                        cursor: habitsCount > 0 ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        opacity: habitsCount > 0 ? 0.5 : 1,
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}