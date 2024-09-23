import { useState, useEffect } from "react";
import {
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Flex,
  Text,
  Heading,
  Center,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { EventForm } from "../components/EventForm";
import { DeleteEvent } from "../components/DeleteEvent";

export const loader = async ({ params }) => {
  const eventId = parseInt(params.eventId);
  const event = await (
    await fetch(`http://localhost:3000/events?id=${eventId}`)
  ).json();
  return event.length > 0 ? event[0] : null;
};

export const EventPage = () => {
  const eventDetails = useLoaderData();
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

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

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const usersData = await response.json();
        const parsedUsers = usersData.map((user) => ({
          ...user,
          id: parseInt(user.id),
        }));
        setUsers(parsedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchCategories();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (eventDetails && eventDetails.categoryIds) {
      setCheckedItems(eventDetails.categoryIds);
    }
  }, [eventDetails]);

  const createdByUser = eventDetails?.createdBy
    ? users.find((user) => user.id === eventDetails.createdBy)
    : null;

  const handleCheckedItemsUpdate = (checkedItems) => {
    setCheckedItems(checkedItems);
  };

  const handleEditSubmit = async (formData) => {
    setIsLoading(true);
    try {
      formData.categoryIds = checkedItems;
      const update = await fetch(
        `http://localhost:3000/events/${eventDetails.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (update.ok) {
        onClose();
        toast({
          title: "Event updated.",
          description: "The event has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate(`/events/${eventDetails.id}`);
      } else {
        const errorData = await update.json();
        throw new Error(errorData.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error updating event.",
        description:
          error.message || "An error occurred while updating the event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!eventDetails) return;

    console.log("Attempting to delete event with ID:", eventDetails.id);

    try {
      const response = await fetch(
        `http://localhost:3000/events/${eventDetails.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Failed to delete event. Status: ${response.status}`
        );
      }

      onClose();
      toast({
        title: "Event deleted.",
        description: "Sadly, this event is no more.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error deleting event.",
        description: error.message || "Yikes, we couldn't delete this event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!eventDetails) {
    return (
      <Center p={4} mt={30} mb={40}>
        <Text fontSize="lg" color="red.500">
          Event not found.
        </Text>
      </Center>
    );
  }

  return (
    <>
      {isLoading ? (
        <Box textAlign="center" p={4}>
          <Text>Loading..</Text>
        </Box>
      ) : (
        <Center p={4} mt={30} mb={40}>
          <Box width="100%" maxWidth="75%">
            <Heading textAlign="center" mb={15}>
              {eventDetails.title}
            </Heading>
            <Flex direction={["column", "row"]}>
              <Box flex="1" display="flex" flexDirection="column">
                <Box mb={15}>
                  <img
                    src={
                      eventDetails.image.startsWith("https://") &&
                      (eventDetails.image.endsWith(".jpg") ||
                        eventDetails.image.endsWith(".jpeg"))
                        ? eventDetails.image
                        : "https://as1.ftcdn.net/v2/jpg/08/29/76/50/1000_F_829765074_plHjFg6YrbWEj0cXdBBJUiNQBTpv4HHP.jpg"
                    }
                    alt="Event"
                    style={{
                      height: "250px",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
                <Text mb={4} mr={20}>
                  {eventDetails.description}
                </Text>
                <Flex mt={50} justify="flex-start">
                  <Button
                    colorScheme="pink"
                    variant="solid"
                    onClick={onOpen}
                    mr="50px"
                  >
                    Edit event
                  </Button>
                  <DeleteEvent onDelete={handleDelete} />
                </Flex>
              </Box>
              <Box flex="1" w="25vw">
                <Box mb={4} ml={50}>
                  <Heading className="heading-block" size="md">
                    DETAILS
                  </Heading>
                  <Text fontWeight="bold">Start time:</Text>
                  <Text mb={15}>
                    {eventDetails.startTime.substring(0, 10)} |{" "}
                    {eventDetails.startTime.substring(11, 16)}
                  </Text>
                  <Text fontWeight="bold">End time:</Text>
                  <Text mb={15}>
                    {eventDetails.endTime.substring(0, 10)} |{" "}
                    {eventDetails.endTime.substring(11, 16)}
                  </Text>
                  <Text fontWeight="bold">Categories:</Text>
                  <Box mb={25}>
                    {eventDetails.categoryIds &&
                      eventDetails.categoryIds.map((id) => (
                        <Badge
                          variant="outline"
                          colorScheme="pink"
                          key={id}
                          mr={5}
                        >
                          {categories.find((category) => category.id === id)
                            ?.name || `Category ${id}`}
                        </Badge>
                      ))}
                  </Box>
                  <Box mb={4}>
                    <Heading className="heading-block" size="md">
                      LOCATION
                    </Heading>
                    <Text mb={25}>{eventDetails.location}</Text>
                  </Box>
                  <Box>
                    <Heading className="heading-block" size="md">
                      ORGANISER
                    </Heading>
                    <Flex align="center">
                      <Avatar
                        className="avatar"
                        src={createdByUser?.image}
                        name={createdByUser?.name}
                        size="md"
                      />
                      <Text ml={2}>{createdByUser?.name}</Text>
                    </Flex>
                  </Box>
                </Box>
              </Box>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
              <ModalContent
                maxW="fit-content"
                mx="auto"
                backgroundColor="#b7a4c4"
                mt="10vh"
              >
                <ModalHeader mt={25} fontWeight="bold">
                  <Center>Edit event</Center>
                </ModalHeader>
                <ModalBody>
                  <EventForm
                    initialValues={eventDetails}
                    isLoading={isLoading}
                    onSubmit={handleEditSubmit}
                    onClose={onClose}
                    updateCheckedItems={handleCheckedItemsUpdate}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        </Center>
      )}
    </>
  );
};
