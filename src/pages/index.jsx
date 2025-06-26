import Head from "next/head";

const IndexPage = () => {
  return (
    <>
      <Head>
        <title>Next.js App</title>
      </Head>
      
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Welcome to Next.js
        </h1>
        <p style={{ textAlign: "center", color: "#666" }}>
          Get started by editing this page.
        </p>
      </div>
    </>
  );
};

export default IndexPage;
