import Head from "next/head";
import { Container, Title, Text, Button, Group } from "@mantine/core";

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js with Mantine</title>
        <meta name="description" content="Next.js app with Mantine UI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="md" py="xl">
        <Title order={1} mb="md">Welcome to Next.js with Mantine!</Title>
        <Text size="lg" mb="xl">
          Mantine has been successfully set up in your Next.js project.
        </Text>
        <Group>
          <Button variant="filled">Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </Group>
      </Container>
    </>
  );
}
