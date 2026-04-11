import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api, SeedOptions } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

const parseOptionalNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export default function ApiLabScreen() {
  const { token, user } = useAuthStore();

  const [email, setEmail] = useState(user?.email ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [userId, setUserId] = useState(user?.id ?? '');

  const [boardId, setBoardId] = useState('');
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDescription, setBoardDescription] = useState('');

  const [listId, setListId] = useState('');
  const [listTitle, setListTitle] = useState('');

  const [cardId, setCardId] = useState('');
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');

  const [usersCount, setUsersCount] = useState('');
  const [boardsPerUser, setBoardsPerUser] = useState('');
  const [listsPerBoard, setListsPerBoard] = useState('');
  const [cardsPerList, setCardsPerList] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('Run an action to see API response here.');

  const seedOptions = useMemo<SeedOptions>(() => ({
    usersCount: parseOptionalNumber(usersCount),
    boardsPerUser: parseOptionalNumber(boardsPerUser),
    listsPerBoard: parseOptionalNumber(listsPerBoard),
    cardsPerList: parseOptionalNumber(cardsPerList),
  }), [usersCount, boardsPerUser, listsPerBoard, cardsPerList]);

  const runAction = async (label: string, action: () => Promise<unknown>) => {
    setIsLoading(true);
    try {
      const data = await action();
      setResult(`${label}\n\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setResult(`${label}\n\nERROR: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="pt-3 pb-6 border-b border-zinc-800 mb-5">
          <Button title="Back" variant="secondary" onPress={() => router.back()} className="mb-4" />
          <Text className="text-3xl font-black text-cyan-400">API LAB</Text>
          <Text className="text-zinc-400 mt-1">Trigger every backend endpoint from one screen.</Text>
          <Text className="text-zinc-500 mt-2 text-xs">Auth token: {token ? 'available' : 'missing'}</Text>
        </View>

        <Text className="text-white text-lg font-bold mb-2">User APIs</Text>
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <Button title="Get User By Email" onPress={() => runAction('GET /users/:email', () => api.users.getByEmail(email.trim()))} className="mb-3" />
        <Input label="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
        <Button
          title="Forget Password"
          onPress={() => runAction('PUT /users/forget-password/:email', () => api.users.forgetPassword(email.trim(), newPassword))}
          className="mb-3"
        />
        <Input label="User ID" value={userId} onChangeText={setUserId} />
        <Input label="New Name" value={newName} onChangeText={setNewName} />
        <Button
          title="Change Name"
          onPress={() => runAction('PUT /users/change-name/:id', () => api.users.changeName(userId.trim(), newName.trim()))}
          className="mb-6"
        />

        <Text className="text-white text-lg font-bold mb-2">Board APIs</Text>
        <Input label="Board Title" value={boardTitle} onChangeText={setBoardTitle} />
        <Input label="Board Description" value={boardDescription} onChangeText={setBoardDescription} />
        <Button
          title="Create Board"
          onPress={() => runAction('POST /boards/create', () => api.boards.create({ title: boardTitle, description: boardDescription }, token))}
          className="mb-3"
        />
        <Button title="Get All Boards" onPress={() => runAction('GET /boards', () => api.boards.getAll(token))} className="mb-3" />
        <Input label="Board ID" value={boardId} onChangeText={setBoardId} />
        <Button
          title="Get Board By ID"
          onPress={() => runAction('GET /boards/:boardId', () => api.boards.getById(boardId.trim(), token))}
          className="mb-3"
        />
        <Button
          title="Delete Board"
          variant="outline"
          onPress={() => runAction('DELETE /boards/:boardId', () => api.boards.remove(boardId.trim(), token))}
          className="mb-6"
        />

        <Text className="text-white text-lg font-bold mb-2">List APIs</Text>
        <Input label="List Title" value={listTitle} onChangeText={setListTitle} />
        <Button
          title="Create List"
          onPress={() => runAction('POST /lists/create', () => api.lists.create({ boardId: boardId.trim(), title: listTitle.trim() }, token))}
          className="mb-3"
        />
        <Button title="Get Lists" onPress={() => runAction('GET /lists/get', () => api.lists.getMany(token))} className="mb-3" />
        <Button title="Get All Lists" onPress={() => runAction('GET /lists/getall', () => api.lists.getAll(token))} className="mb-3" />
        <Input label="List ID" value={listId} onChangeText={setListId} />
        <Button
          title="Get List By ID"
          onPress={() => runAction('GET /lists/get/:listId', () => api.lists.getById(listId.trim(), token))}
          className="mb-3"
        />
        <Button
          title="Get Lists By Board ID"
          onPress={() => runAction('GET /lists/getbyboard/:boardId', () => api.lists.getByBoardId(boardId.trim(), token))}
          className="mb-3"
        />
        <Button
          title="Delete List"
          variant="outline"
          onPress={() => runAction('DELETE /lists/delete/:listId', () => api.lists.remove(listId.trim(), token))}
          className="mb-6"
        />

        <Text className="text-white text-lg font-bold mb-2">Card APIs</Text>
        <Input label="Card Title" value={cardTitle} onChangeText={setCardTitle} />
        <Input label="Card Description" value={cardDescription} onChangeText={setCardDescription} />
        <Button
          title="Create Card"
          onPress={() => runAction('POST /cards/:listId', () => api.cards.create(listId.trim(), { title: cardTitle.trim(), description: cardDescription.trim() }, token))}
          className="mb-3"
        />
        <Button
          title="Get Cards By List ID"
          onPress={() => runAction('GET /cards/:listId', () => api.cards.getByListId(listId.trim(), token))}
          className="mb-3"
        />
        <Input label="Card ID" value={cardId} onChangeText={setCardId} />
        <Input label="New Card Title" value={newCardTitle} onChangeText={setNewCardTitle} />
        <Input label="New Card Description" value={newCardDescription} onChangeText={setNewCardDescription} />
        <Button
          title="Update Card"
          onPress={() => runAction('PUT /cards/:cardId', () => api.cards.update(cardId.trim(), { newTitle: newCardTitle.trim(), newDescription: newCardDescription.trim() }, token))}
          className="mb-6"
        />

        <Text className="text-white text-lg font-bold mb-2">Test Data APIs</Text>
        <Input label="usersCount" value={usersCount} onChangeText={setUsersCount} keyboardType="number-pad" />
        <Input label="boardsPerUser" value={boardsPerUser} onChangeText={setBoardsPerUser} keyboardType="number-pad" />
        <Input label="listsPerBoard" value={listsPerBoard} onChangeText={setListsPerBoard} keyboardType="number-pad" />
        <Input label="cardsPerList" value={cardsPerList} onChangeText={setCardsPerList} keyboardType="number-pad" />
        <Button
          title="Preview Test Data"
          onPress={() => runAction('GET /test-data/preview', () => api.testData.preview(seedOptions))}
          className="mb-3"
        />
        <Button
          title="Seed Test Data"
          onPress={() => runAction('POST /test-data/seed', () => api.testData.seed(seedOptions))}
          className="mb-6"
        />

        <Text className="text-white text-lg font-bold mb-2">Response</Text>
        <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3">
          <Text className="text-zinc-300 text-xs leading-5">{result}</Text>
        </View>
        {isLoading ? <Text className="text-cyan-400 text-center">Running request...</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
