import { Box, Button, Flex, Grid, Select, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'

import { api } from '../../lib/api'

export default function SendPacket() {
    const [connectionId, setConnectionId] = useState<string>('')
    const [packetData, setPacketData] = useState<string>('')
    const [direction, setDirection] = useState<'upstream' | 'downstream'>('upstream')

    async function sendPacket() {
        if (!connectionId || !packetData) return

        if (!(await api.sendPacket({ direction, connectionId, data: packetData }))) {
            notifications.show({
                color: 'red',
                message: 'Fail to send packet, invalid connection ID.',
            })
        }
    }

    return (
        <Box>
            <h2>Send a packet</h2>

            <Grid justify="space-between">
                <Grid.Col span={2}>
                    <Flex gap="md">
                        <TextInput
                            type="text"
                            placeholder="Connection ID"
                            value={connectionId}
                            onChange={(e) => setConnectionId(e.currentTarget.value)}
                            style={{ flex: 1 }}
                        />
                    </Flex>
                </Grid.Col>

                <Grid.Col span={2}>
                    <Flex gap="md">
                        <Select
                            value={direction}
                            onChange={(value) => setDirection(value === 'upstream' ? 'upstream' : 'downstream')}
                            data={[
                                { label: 'Upstream', value: 'upstream' },
                                { label: 'Downstream', value: 'downstream' },
                            ]}
                        />
                    </Flex>
                </Grid.Col>

                <Grid.Col span={8}>
                    <Flex gap="md">
                        <TextInput
                            placeholder="Packet data"
                            value={packetData}
                            onChange={(e) => setPacketData(e.currentTarget.value)}
                            style={{ flex: 1 }}
                        />

                        <Button onClick={sendPacket}>Send packet</Button>
                    </Flex>
                </Grid.Col>
            </Grid>
        </Box>
    )
}
