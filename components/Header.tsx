import * as React from "react";
import { Container, Box, Link } from "@mui/material";
import avertroIcon from "../public/avertro-logo.png";
import Image from "next/image";
import vercelIcon from "../public/vercel.svg";
export default function Header() {
  return (
    <Container>
      <Box
        sx={{
          my: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href="/">
          <Image src={vercelIcon} alt="practise" />
        </Link>
      </Box>
    </Container>
  );
}
