import store from '../redux/store'
import { Provider } from 'react-redux'

import '../styles/globals.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function MyApp({ Component, pageProps}) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}