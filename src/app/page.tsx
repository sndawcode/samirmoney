import { Section, Container, Heading } from "@/components/ui/section";

export default function Home() {
  return (
    <Section theme="ink" texture>
      <Container>
        <Heading as="h1" size="display-xl">
          Tous vos paiements. Un seul écosystème.
        </Heading>
      </Container>
    </Section>
  );
}
