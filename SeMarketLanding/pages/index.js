import Intro from './intro'
import GlobalState from '../context/globalState'
import '../styles/index.scss'

export default () => (
    <GlobalState>
        <Intro />
    </GlobalState>
)
