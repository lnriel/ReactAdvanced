import {
  Card,
  CardBody,
  CardFooter,
  Box,
  Image,
  Text,
  Badge,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export const EventItem = ({ event }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        const categoriesData = await response.json();
        const parsedCategories = categoriesData.map((category) => ({
          ...category,
          id: parseInt(category.id),
        }));
        setCategories(parsedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      maxH="20vw"
      bg="#f6f6f6"
    >
      <Image
        objectFit="cover"
        maxW="20vw"
        src={
          event.image !== "" &&
          event.image.startsWith("https://") &&
          (event.image.endsWith(".jpg") || event.image.endsWith(".jpeg"))
            ? event.image
            : "https://as1.ftcdn.net/v2/jpg/08/29/76/50/1000_F_829765074_plHjFg6YrbWEj0cXdBBJUiNQBTpv4HHP.jpg"
        }
        alt={event.title}
      />
      <Box ml={25} flex="1">
        <CardBody>
          <Text fontSize="xl" fontWeight="bold">
            {event.title}
          </Text>

          <HStack mt={2} mb={5} spacing={5}>
            {event.categoryIds.map((id) => (
              <Badge variant="outline" colorScheme="pink" key={id}>
                {categories.find((category) => category.id === id)?.name ||
                  `Category ${id}`}
              </Badge>
            ))}
          </HStack>

          <Text>{event.description}</Text>
        </CardBody>
        <CardFooter>
          <Flex justify="space-between" width="70%" mt={2}>
            <Box>
              <Text fontWeight="bold">Starttime</Text>
              <Text>
                {event.startTime.substring(0, 10)} |{" "}
                {event.startTime.substring(11, 16)}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Endtime</Text>
              <Text>
                {event.endTime.substring(0, 10)} |{" "}
                {event.endTime.substring(11, 16)}
              </Text>
            </Box>
          </Flex>
        </CardFooter>
      </Box>
    </Card>
  );
};
