'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  // State variables
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [allProfessionals, setAllProfessionals] = useState<any[]>([])
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [enteredPassword, setEnteredPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()

  // Filter professionals by name OR phone number
  const search = (term: string) => {
    const normalized = term.toLowerCase()
    const filtered = allProfessionals.filter((p) =>
      p.nome.toLowerCase().includes(normalized) ||
      p.telefone.toLowerCase().includes(normalized)
    )
    setResults(filtered)
  }

  // Load all professionals from API
  const loadProfessionals = async () => {
    const res = await fetch('/api/profissionais')
    const data = await res.json()
    setAllProfessionals(data)
  }

  // Run once on mount
  useEffect(() => {
    loadProfessionals()
  }, [])

  // When the search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([])
      return
    }

    search(searchTerm)

    // Reset input and results after 10 seconds of inactivity
    const timeout = setTimeout(() => {
      setSearchTerm('')
      setResults([])
    }, 10_000)

    return () => clearTimeout(timeout)
  }, [searchTerm])

  // Handle admin password validation
  const checkPassword = () => {
    if (enteredPassword === 'leonardo') {
      router.push('/admin')
    } else {
      setPasswordError('Senha errada.')
    }
  }

  return (
    <div style={{ padding: '2rem', background: '#f4f4f4', minHeight: '100vh', position: 'relative' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', color: '#333' }}>
        Consulta de Profissionais
      </h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Digite nome ou telefone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto 2rem auto',
          padding: '1rem',
          fontSize: '1.2rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          color: '#333',
        }}
      />

      {/* Results list as responsive cards */}
      {searchTerm.trim() !== '' && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {results.map((p) => (
            <div
              key={p.id}
              style={{
                width: '280px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                padding: '1.5rem',
                textAlign: 'center',
                border: '1px solid #eee',
              }}
            >
              <h3 style={{ fontSize: '1.4rem', color: '#0070f3', marginBottom: '1rem' }}>{p.nome}</h3>
              <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
                <strong>Andar:</strong> {p.andar}
              </p>
              <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
                <strong>Sala:</strong> {p.sala}
              </p>
              <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
                <strong>Tel:</strong> {p.telefone}
              </p>
            </div>
          ))}
          {results.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888' }}>
              No results found.
            </p>
          )}
        </div>
      )}

      {/* Admin button (⚙️) in bottom right */}
      <button
        onClick={() => setShowPasswordModal(true)}
        style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '1.8rem',
          cursor: 'pointer',
          color: '#888',
        }}
        title="Admin"
      >
        ⚙️
      </button>

      {/* Password modal for admin access */}
      {showPasswordModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '8px',
              width: '300px',
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
          >
            <h2>Área Restrita</h2>
            <input
              type="password"
              placeholder="Digite a senha"
              value={enteredPassword}
              onChange={(e) => {
                setEnteredPassword(e.target.value)
                setPasswordError('')
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '1rem',
                marginBottom: '1rem',
                fontSize: '1rem',
              }}
            />
            <button
              onClick={checkPassword}
              style={{
                backgroundColor: '#0070f3',
                color: 'white',
                padding: '0.6rem 1rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Entrar
            </button>
            {passwordError && <p style={{ color: 'red', marginTop: '1rem' }}>{passwordError}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
