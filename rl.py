import gym
import numpy as np
from gym import spaces

class DhyanTutorEnv(gym.Env):
    def __init__(self):
        super(DhyanTutorEnv, self).__init__()
        
        self.observation_space = spaces.Box(low=0, high=1, shape=(40,), dtype=np.float32)
        
        self.action_space = spaces.Discrete(40)  # 40 actions

        self.state = np.random.rand(40)
        self.done = False

    def step(self, action):
        reward = self._calculate_reward(action)
        
        self.state = np.clip(self.state + np.random.uniform(-0.1, 0.1, 40), 0, 1)

        return self.state, reward, self.done, {}

    def reset(self):
        self.state = np.random.rand(40)
        self.done = False
        return self.state

    def _calculate_reward(self, action):
        if action in [0, 1, 2]:  # Example: Providing hints
            return 1.0 if np.random.rand() > 0.5 else -0.5
        elif action in [10, 15]:  # Example: Personalizing content
            return 2.0 if np.random.rand() > 0.3 else -1.0
        else:
            return np.random.uniform(-0.5, 1.0)

