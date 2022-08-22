import { wrapper } from '../redux/store'
import '../styles/global/index.scss'

import { ThemeProvider } from 'next-themes'
import '@fortawesome/fontawesome-svg-core/styles.css'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default wrapper.withRedux(MyApp);