import { createRoot } from 'react-dom/client'

import { Home } from './screens/Home'

function render() {
    const root = createRoot(document.getElementById('root'))

    root.render(<Home />)
}

render()
