import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  useDisclosure,
  useToast,
  Select,
  Box,
  HStack,
  ModalHeader,
  Center,
} from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom";
import { EventItem } from "../components/EventItem";
import { EventForm } from "../components/EventForm";
import { SearchBar } from "../components/SearchBar";

export const loader = async () => {
  const events = await fetch("http://localhost:3000/events");
  return {
    events: await events.json(),
  };
};

export const EventsPage = () => {
  const { events } = useLoaderData();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const toast = useToast();

  const initialFormData = {
    title: "",
    image: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
    createdBy: 1,
  };

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

  useEffect(() => {
    if (events) {
      let filteredEvents = events;

      if (selectedCategoryFilter !== "") {
        filteredEvents = events.filter((event) =>
          event.categoryIds.some(
            (categoryId) =>
              categories.find((category) => category.id === categoryId)
                ?.name === selectedCategoryFilter
          )
        );
      }

      if (searchTerm !== "") {
        filteredEvents = filteredEvents.filter((event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredEvents(filteredEvents);
    }
  }, [searchTerm, selectedCategoryFilter, events, categories]);

  const handleCategoryFilterChange = (category) => {
    setSelectedCategoryFilter(category);
  };

  const handleCheckedItemsUpdate = (checkedItems) => {
    setCheckedItems(checkedItems);
  };

  const handleAddEventSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const highestEventId = Math.max(...events.map((event) => event.id));
      const newEventId = highestEventId + 1;
      formData.id = newEventId;
      formData.categoryIds = checkedItems;

      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Event created.",
          description: "We've created your event succesfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setFilteredEvents((prevEvents) => [...prevEvents, formData]);
        onClose();
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Oooops, something went wrong while creating your event",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="Center" bg="#b7a4c4" mb={50}>
        <HStack w="60vw" spacing={30} padding="20px">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <Select
            placeholder="All events"
            value={selectedCategoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            bg="white"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
          <Button w="15vw" colorScheme="pink" variant="solid" onClick={onOpen}>
            Add Event
          </Button>
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
        <ModalContent
          maxW="fit-content"
          mx="auto"
          backgroundColor="#b7a4c4"
          mt="10vh"
        >
          <ModalHeader mt={25} fontWeight="bold">
            <Center>Add event</Center>
          </ModalHeader>
          <ModalBody>
            <EventForm
              initialValues={initialFormData}
              onSubmit={handleAddEventSubmit}
              isLoading={isLoading}
              onClose={onClose}
              updateCheckedItems={handleCheckedItemsUpdate}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Center>
        <Box mb={25}>
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              style={{ display: "block", marginBottom: "16px" }}
            >
              <Box w="60vw" p={4}>
                <EventItem event={event} />
              </Box>
            </Link>
          ))}
        </Box>
      </Center>
    </Box>
  );
};
