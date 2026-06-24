import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  Agent,
  CreateAgentDto,
  UpdateAgentDto,
} from '../interfaces/agents.interfaces';

export async function getAgents(organizationUuid: string): Promise<Agent[]> {
  try {
    const response = await axiosInstance.get<Agent[]>(
      ApiRoutes.organizations.agents(organizationUuid),
    );
    return response.data;
  } catch {
    throw new Error('Failed to load agents. Please try again.');
  }
}

export async function getAgent(
  organizationUuid: string,
  agentUuid: string,
): Promise<Agent> {
  try {
    const response = await axiosInstance.get<Agent>(
      ApiRoutes.organizations.agent(organizationUuid, agentUuid),
    );
    return response.data;
  } catch {
    throw new Error('Failed to load agent. Please try again.');
  }
}

export async function createAgent(
  organizationUuid: string,
  payload: CreateAgentDto,
): Promise<Agent> {
  try {
    const response = await axiosInstance.post<Agent>(
      ApiRoutes.organizations.agents(organizationUuid),
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string | string[] } } })?.response?.data
        ?.message;
    if (typeof message === 'string') {
      throw new Error(message);
    }
    if (Array.isArray(message)) {
      throw new Error(message.join(', '));
    }
    throw new Error('Failed to create agent. Please try again.');
  }
}

export async function updateAgent(
  organizationUuid: string,
  agentUuid: string,
  payload: UpdateAgentDto,
): Promise<Agent> {
  try {
    const response = await axiosInstance.patch<Agent>(
      ApiRoutes.organizations.agent(organizationUuid, agentUuid),
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string | string[] } } })?.response?.data
        ?.message;
    if (typeof message === 'string') {
      throw new Error(message);
    }
    if (Array.isArray(message)) {
      throw new Error(message.join(', '));
    }
    throw new Error('Failed to update agent. Please try again.');
  }
}

export async function deleteAgent(
  organizationUuid: string,
  agentUuid: string,
): Promise<void> {
  try {
    await axiosInstance.delete(
      ApiRoutes.organizations.agent(organizationUuid, agentUuid),
    );
  } catch {
    throw new Error('Failed to delete agent. Please try again.');
  }
}
