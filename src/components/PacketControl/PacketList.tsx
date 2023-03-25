import { ActionIcon, Box, Button, Code, CopyButton, Flex, Grid, Select, Table, TextInput, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
    IconArrowDown,
    IconArrowUp,
    IconCheck,
    IconCopy,
    IconPlayerPlay,
    IconPlayerStop,
    IconTrash,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'

import { api } from '../../lib/api'
import { getHeader } from '../../utils/packet'

type Packet = {
    connectionId: string
    direction: 'upstream' | 'downstream'
    header: ReturnType<typeof getHeader>
    data: string
    fullData: string
}

export default function PacketList() {
    const [isRecording, setIsRecording] = useState(true)

    const [directionFilter, setDirectionFilter] = useState<'both' | 'upstream' | 'downstream'>('both')
    const [ignorePacketsFilter, setIgnorePacketsFilter] = useState<string | null>('36c, 165, 364, 181, d1d')

    const [packets, setPackets] = useState<Packet[]>([])
    const filtered = packets.filter((packet) => directionFilter === 'both' || packet.direction === directionFilter)

    useEffect(() => {
        return api.onPacket(({ connectionId, direction, data }) => {
            const header = getHeader(data)

            if (
                !isRecording ||
                ignorePacketsFilter
                    .split(',')
                    .map((ignored) => ignored.trim())
                    .includes(header.packetId)
            ) {
                return
            }

            const packet = { connectionId, direction, header, data: data.slice(24), fullData: data }
            setPackets((packets) => [packet, ...packets].slice(0, 100))
        })
    }, [isRecording, ignorePacketsFilter])

    async function replay({
        connectionId,
        direction,
        data,
    }: {
        connectionId: string
        direction: 'upstream' | 'downstream'
        data: string
    }) {
        await api.sendPacket({ connectionId, direction, data })

        notifications.show({
            color: 'green',
            message: `${direction} packet sent.`,
        })
    }

    return (
        <Box mt="md">
            <h2>Real time packets</h2>

            <Grid mb="md">
                <Grid.Col span={2}>
                    <Flex>
                        <Button
                            onClick={() => setIsRecording((isRecording) => !isRecording)}
                            leftIcon={isRecording ? <IconPlayerStop size={18} /> : <IconPlayerPlay size={18} />}
                            color={isRecording ? 'red' : 'green'}
                            style={{ flex: 1 }}
                            mr="sm"
                        >
                            <span className="ml-2">{isRecording ? 'Stop' : 'Start'}</span>
                        </Button>

                        <Button onClick={() => setPackets([])} leftIcon={<IconTrash size={18} />} style={{ flex: 1 }}>
                            Clear
                        </Button>
                    </Flex>
                </Grid.Col>

                <Grid.Col span={2}>
                    <Flex gap="md">
                        <Select
                            value={directionFilter}
                            onChange={(value) => setDirectionFilter(value as 'both' | 'upstream' | 'downstream')}
                            data={[
                                { label: 'Both', value: 'both' },
                                { label: 'Upstream', value: 'upstream' },
                                { label: 'Downstream', value: 'downstream' },
                            ]}
                        />
                    </Flex>
                </Grid.Col>

                <Grid.Col span={8}>
                    <Flex gap="md">
                        <TextInput
                            w={400}
                            type="text"
                            placeholder="Ignore packets"
                            value={ignorePacketsFilter}
                            onChange={(e) => setIgnorePacketsFilter(e.currentTarget.value)}
                            style={{ flex: 1 }}
                        />
                    </Flex>
                </Grid.Col>
            </Grid>

            <Table mt="lg">
                <thead>
                    <tr>
                        <td scope="col" width={50}></td>
                        <td scope="col" width={80}>
                            Size
                        </td>
                        <td scope="col" width={120}>
                            Packet ID
                        </td>
                        <td scope="col" width={120}>
                            Client ID
                        </td>
                        <td scope="col">Data</td>
                        <td scope="col" width={20}></td>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={6}>
                                <Flex align="center" justify="center" mt="lg">
                                    No packets to display
                                </Flex>
                            </td>
                        </tr>
                    )}

                    {filtered.slice(0, 8).map((packet, index) => (
                        <tr key={index} className={index % 2 === 0 ? undefined : 'bg-gray-50'}>
                            <td>
                                <Tooltip
                                    label={packet.direction === 'upstream' ? 'Upstream' : 'Downstream'}
                                    withArrow
                                    position="right"
                                >
                                    {packet.direction === 'upstream' ? (
                                        <IconArrowUp color="blue" />
                                    ) : (
                                        <IconArrowDown color="green" />
                                    )}
                                </Tooltip>
                            </td>
                            <td>{packet.header.size}</td>
                            <td>{packet.header.packetId}</td>
                            <td>{packet.header.clientId}</td>
                            <td>
                                <Code display="block">{packet.data.slice(0, 100) || '---'}</Code>
                            </td>
                            <td>
                                <Flex>
                                    <Tooltip label="Replay" withArrow position="right">
                                        <ActionIcon
                                            color="indigo"
                                            onClick={() =>
                                                replay({
                                                    connectionId: packet.connectionId,
                                                    direction: packet.direction,
                                                    data: packet.fullData,
                                                })
                                            }
                                        >
                                            <IconPlayerPlay size="1rem" />
                                        </ActionIcon>
                                    </Tooltip>

                                    <CopyButton value={packet.fullData} timeout={2000}>
                                        {({ copied, copy }) => (
                                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                                <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                                    {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </CopyButton>
                                </Flex>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Box>
    )
}
