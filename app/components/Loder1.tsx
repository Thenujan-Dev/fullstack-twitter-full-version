"use client";
import React from "react";
import { Box, Skeleton, Stack, Avatar } from "@mui/material";

const RightSidebarSkeleton = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "black",
        color: "white",
        p: 2,
      }}
    >
      <Skeleton
        variant="text"
        width={100}
        height={30}
        sx={{ bgcolor: "grey.800", mb: 2 }}
      />

      <Stack spacing={3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Box key={index} display="flex" alignItems="center" gap={2}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ bgcolor: "grey.800" }}
            />
            <Box>
              <Skeleton
                variant="text"
                width={100}
                height={20}
                sx={{ bgcolor: "grey.800" }}
              />
              <Skeleton
                variant="text"
                width={60}
                height={15}
                sx={{ bgcolor: "grey.700" }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default RightSidebarSkeleton;
