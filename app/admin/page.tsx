'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    andar: '',
    sala: '',
    telefone: '',
  })

  const [statusMessage, setStatusMessage] = useState('')
  const [professionals, setProfessionals] = useState<any[]>([])
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const router = useRouter()

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle form submission for create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(editMode ? 'Atualizando...' : 'Salvando...')

    const method = editMode ? 'PUT' : 'POST'
    const url = editMode ? `/api/profissionais/${editId}` : '/api/profissionais'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setStatusMessage(editMode ? 'Atualizado com sucesso!' : 'Cadastrado com sucesso!')
      setFormData({ nome: '', andar: '', sala: '', telefone: '' })
      setEditMode(false)
      setEditId(null)
      fetchProfessionals()
    } else {
      setStatusMessage('Erro ao salvar.')
    }
  }

  // Delete a professional by ID
  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/profissionais/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      fetchProfessionals()
    }
  }

  // Fill form with professional data to edit
  const handleEdit = (prof: any) => {
    setFormData({
      nome: prof.nome,
      andar: prof.andar,
      sala: prof.sala,
      telefone: prof.telefone,
    })
    setEditId(prof.id)
    setEditMode(true)
    setStatusMessage('')
  }

  // Load all professionals
  const fetchProfessionals = async () => {
    const res = await fetch('/api/profissionais')
    const data = await res.json()
    setProfessionals(data)
  }

  // Initial data load
  useEffect(() => {
    fetchProfessionals()
  }, [])

  return (
    <div style={{ padding: '2rem', background: '#fdfdfd', minHeight: '100vh', color: '#333' }}>
      {/* Back to home button */}
      <button
        onClick={() => router.push('/')}
        style={{
          marginBottom: '2rem',
          padding: '0.6rem 1rem',
          backgroundColor: '#888',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        ← Voltar para o início
      </button>

      <h1 style={{ marginBottom: '2rem' }}>Administração de Profissionais</h1>

      {/* Form to add or edit professional */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', maxWidth: '500px' }}>
        <input name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
        <input name="andar" placeholder="Andar" value={formData.andar} onChange={handleChange} required />
        <input name="sala" placeholder="Sala" value={formData.sala} onChange={handleChange} required />
        <input name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} required />
        <button type="submit">{editMode ? 'Atualizar' : 'Cadastrar'}</button>
        <p style={{ marginTop: '1rem', color: '#007700' }}>{statusMessage}</p>
      </form>

      {/* List of professionals as cards */}
      <h2 style={{ marginBottom: '1rem' }}>Profissionais cadastrados</h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          justifyContent: 'flex-start',
        }}
      >
        {professionals.map((prof) => (
          <div
            key={prof.id}
            style={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '1.2rem',
              width: '280px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              position: 'relative',
            }}
          >
            <h3 style={{ marginBottom: '0.5rem', color: '#0070f3' }}>{prof.nome}</h3>
            <p style={{ margin: '0.3rem 0' }}><strong>Andar:</strong> {prof.andar}</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Sala:</strong> {prof.sala}</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Telefone:</strong> {prof.telefone}</p>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleEdit(prof)}
                style={{
                  backgroundColor: '#ffaa00',
                  color: '#fff',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(prof.id)}
                style={{
                  backgroundColor: '#cc0000',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input and button styles */}
      <style jsx>{`
        input {
          display: block;
          width: 100%;
          margin-bottom: 1rem;
          padding: 0.8rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button[type='submit'] {
          background-color: #0070f3;
          color: white;
          padding: 0.7rem 1.2rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
