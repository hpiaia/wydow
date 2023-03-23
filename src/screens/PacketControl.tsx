import ConnectionsList from '../components/PacketControl/ConnectionsList'
import SendPacketForm from '../components/PacketControl/SendPacketForm'

export function PacketControl() {
    return (
        <div>
            <ConnectionsList />
            <SendPacketForm />
        </div>
    )
}
