import '../styles/globals.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core"
library.add(far, fas)
config.autoAddCss = false

export default function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  )
}