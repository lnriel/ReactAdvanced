import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Checkbox,
  Flex,
  Button,
  Input,
  Textarea,
  Select,
  Spinner,
} from "@chakra-ui/react";

export const EventForm = ({
  initialValues,
  onSubmit,
  isLoading,
  onClose,
  updateCheckedItems,
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [user, setUser] = useState(initialValues.createdBy);
  const [checkedItems, setCheckedItems] = useState(
    initialValues.categoryIds || []
  );
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3000/categories");
      const categoriesData = await response.json();
      const parsedCategories = categoriesData.map((category) => ({
        ...category,
        id: parseInt(category.id),
      }));
      setCategories(parsedCategories);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:3000/users");
      const usersData = await response.json();
      const parsedUsers = usersData.map((user) => ({
        ...user,
        id: parseInt(user.id),
      }));
      setUsers(parsedUsers);
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserChange = (e) => {
    setUser(e.target.value);
  };

  const handleCategoryCheck = (categoryId, isChecked) => {
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = isChecked
        ? [...prevCheckedItems, categoryId]
        : prevCheckedItems.filter((id) => id !== categoryId);
      updateCheckedItems(updatedCheckedItems);
      return updatedCheckedItems;
    });
  };

  const isCategoryChecked = (categoryId) => checkedItems.includes(categoryId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      createdBy: parseInt(user),
      categoryIds: checkedItems,
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={5}>
      {isLoading ? (
        <Flex justify="center" align="center">
          <Spinner />
        </Flex>
      ) : (
        <>
          <FormControl id="title" isRequired>
            <FormLabel mb={2} fontWeight="semibold">
              Event Title:
            </FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What's the name of your event?"
              width="100%"
              bg="white"
            />
          </FormControl>

          <FormControl id="description" isRequired mt={15}>
            <FormLabel mb={2} fontWeight="semibold">
              Description:
            </FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your event and why everyone should attend!"
              width="100%"
              rows={5}
              bg="white"
            />
          </FormControl>

          <FormControl id="location" isRequired mt={15}>
            <FormLabel mb={2} fontWeight="semibold">
              Location:
            </FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where is the event?"
              width="100%"
              bg="white"
            />
          </FormControl>

          <FormControl id="image" mt={15}>
            <FormLabel mb={2} fontWeight="semibold">
              Image:
            </FormLabel>
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Link to your awesome event image.jpg"
              width="100%"
              bg="white"
            />
          </FormControl>

          <FormControl
            id="categoryIds"
            isRequired={checkedItems.length === 0}
            mt={30}
          >
            <FormLabel mb={2} fontWeight="semibold">
              The event is categorized as:
            </FormLabel>
            <Flex flexDirection="column" gap={5}>
              {categories.map((category) => (
                <Checkbox
                  key={category.id}
                  value={category.id}
                  isChecked={isCategoryChecked(category.id)}
                  onChange={(e) =>
                    handleCategoryCheck(category.id, e.target.checked)
                  }
                >
                  {category.name}
                </Checkbox>
              ))}
            </Flex>
          </FormControl>

          <Flex mt={30} gap={50}>
            <FormControl id="startTime" isRequired>
              <FormLabel mb={2} fontWeight="semibold">
                Start Date & Time:
              </FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                bg="white"
              />
            </FormControl>

            <FormControl id="endTime" isRequired>
              <FormLabel mb={2} fontWeight="semibold">
                End Date & Time:
              </FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                bg="white"
              />
            </FormControl>
          </Flex>

          <FormControl id="createdBy" isRequired mt={8} mb={8}>
            <FormLabel mb={2} fontWeight="semibold">
              This event is set-up by:
            </FormLabel>
            <Select value={user} onChange={handleUserChange} bg="white">
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Flex flexDir={["column", "row"]} gap={20} mt={30}>
            <Button colorScheme="pink" variant="solid" type="submit" p={6}>
              Submit
            </Button>
            <Button colorScheme="pink" variant="solid" onClick={onClose} p={6}>
              Cancel
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
};
