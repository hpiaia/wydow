import ConnectionsList from '../components/ConnectionsList'
import SendPacketForm from '../components/SendPacketForm'

export function Home() {
    return (
        <div>
            <ConnectionsList />
            <SendPacketForm />
        </div>
    )
}
