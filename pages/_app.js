import store from '../redux/store'
import { Provider } from 'react-redux'
import '../styles/global/globals.scss'

import { ThemeProvider } from 'next-themes'
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}