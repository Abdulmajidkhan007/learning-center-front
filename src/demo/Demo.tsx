import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/app/App'
import { setDemoRole } from './mockApi'
import { DemoBar } from './DemoBar'
import { DEMO_ROLES, type DemoRole } from './roles'

/** Demo ildizi: ilova + rol almashtirgich. */
export function Demo() {
    const [role, setRole] = useState<DemoRole>(DEMO_ROLES[0].value)

    function changeRole(next: DemoRole) {
        setDemoRole(next)
        setRole(next)
    }

    return (
        <>
            {/* `key` — rol o'zgarganda daraxt qayta quriladi va AuthProvider
                sessiyani yangi rol bilan qaytadan tiklaydi. */}
            <App key={role} router={MemoryRouter} />
            <DemoBar role={role} onRoleChange={changeRole} />
        </>
    )
}
