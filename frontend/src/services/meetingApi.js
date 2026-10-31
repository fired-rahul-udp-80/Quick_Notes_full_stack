import apiClient from './api/axios';

export const meetingApi = {
  // Create a new meeting room
  createMeeting: async (meetingData) => {
    const response = await apiClient.post('/meetings/create', meetingData);
    return response.data;
  },

  // Get active public study rooms
  getActiveMeetings: async () => {
    const response = await apiClient.get('/meetings/active');
    return response.data;
  },

  // Get meeting details by room code or ID
  getMeetingByCode: async (roomCode) => {
    const response = await apiClient.get(`/meetings/room/${roomCode}`);
    return response.data;
  },

  // Verify meeting room passcode
  verifyPasscode: async (roomCode, passcode) => {
    const response = await apiClient.post('/meetings/verify-passcode', { roomCode, passcode });
    return response.data;
  },

  // End meeting (host only)
  endMeeting: async (roomCode) => {
    const response = await apiClient.patch(`/meetings/room/${roomCode}/end`);
    return response.data;
  },
};

export default meetingApi;
