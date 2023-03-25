import ConnectionsList from '../components/PacketControl/ConnectionsList'
import PacketList from '../components/PacketControl/PacketList'
import SendPacket from '../components/PacketControl/SendPacket'

export function PacketControl() {
    return (
        <div>
            <ConnectionsList />
            <SendPacket />
            <PacketList />
        </div>
    )
}
