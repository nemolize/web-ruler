import { Button, Container, Group, Text, Title } from "@mantine/core";

export default function Home() {
  return (
    <Container size="md" py="xl">
      <Title order={1} mb="md">
        Welcome to Next.js with Mantine!
      </Title>
      <Text size="lg" mb="xl">
        Mantine has been successfully set up in your Next.js project.
      </Text>
      <Group>
        <Button variant="filled">Primary Button</Button>
        <Button variant="outline">Outline Button</Button>
      </Group>
    </Container>
  );
}
