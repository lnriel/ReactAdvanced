import { useRef } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Text,
  Heading,
  Stack,
} from "@chakra-ui/react";

export const DeleteEvent = ({ onDelete }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleDeleteClick = () => {
    onOpen();
  };

  const handleDeleteConfirm = () => {
    onDelete();
    onClose();
  };

  return (
    <>
      <Button colorScheme="pink" variant="solid" onClick={handleDeleteClick}>
        Delete Event
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay bg="rgba(0, 0, 0, 0.5)">
          <AlertDialogContent
            maxW="fit-content"
            mx="auto"
            backgroundColor="#b7a4c4"
            mt="30vh"
            p={5}
          >
            <Stack spacing={4} p={2}>
              <Heading size="md" mb={5}>
                Delete Event
              </Heading>
              <Text>
                Are you sure you want to delete this event? This action cannot
                be undone.
              </Text>
              <Stack direction="row" spacing={10} justify="flex-end" pt={15}>
                <Button
                  ref={cancelRef}
                  onClick={onClose}
                  colorScheme="pink"
                  variant="solid"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  colorScheme="pink"
                  variant="solid"
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
