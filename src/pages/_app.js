import { wrapper } from '../redux/store'
import '../styles/global/index.scss'

import { ThemeProvider } from 'next-themes'
import '@fortawesome/fontawesome-svg-core/styles.css'
import NextNProgress from 'nextjs-progressbar'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <NextNProgress color="#2B67F6" />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default wrapper.withRedux(MyApp)