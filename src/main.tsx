import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import '@/theme/tokens.css'
import '@/theme/base.css'

export const createRoot = ViteReactSSG({ routes, basename: import.meta.env.BASE_URL })
