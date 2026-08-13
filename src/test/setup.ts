import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Har testdan keyin DOM tozalanadi — aks holda oldingi testning
// komponentlari keyingisining so'rovlariga tushib qoladi.
afterEach(cleanup)
