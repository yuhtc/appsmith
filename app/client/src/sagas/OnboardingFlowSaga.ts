/*
Read and manipulate state to make the onboarding flow

 */

import { AppState } from "../reducers";

const OnboardingFlowSteps = [
  {
    name: "Welcome",
    setup: (dispatch: any) => {
      // dispatch actions that will be needed to setup the state
    },
    tip: {
      title: "",
      description: "",
      isVisible: (state: AppState): boolean => {
        // TODO
        return false;
      },
    },
    description: "",
    isComplete: (state: AppState): boolean => {
      // TODO
      return false;
    },
  },
  {
    name: "Example Database",
    setup: (dispatch: any) => {
      // dispatch actions that will be needed to setup the state
    },
    tip: {
      title: "",
      description: "",
      isVisible: (state: AppState): boolean => {
        // TODO
        return false;
      },
    },
    isComplete: (state: AppState): boolean => {
      // TODO
      return false;
    },
  },
  {
    name: "First widget",
    setup: (dispatch: any) => {
      // dispatch actions that will be needed to setup the state
    },
    tip: {
      title: "",
      description: "",
      snippet: "",
      isVisible: (state: AppState): boolean => {
        // TODO
        return false;
      },
    },
    isComplete: (state: AppState): boolean => {
      // TODO
      return false;
    },
  },
  {
    name: "Successful binding",
    setup: (dispatch: any) => {
      // dispatch actions that will be needed to setup the state
    },
    tip: {
      title: "",
      description: "",
      snippet: "",
      isVisible: (state: AppState): boolean => {
        // TODO
        return false;
      },
    },
    isComplete: (state: AppState): boolean => {
      // TODO
      return false;
    },
  },
  {
    name: "Deploy",
    setup: (dispatch: any) => {
      // dispatch actions that will be needed to setup the state
    },
    tip: {
      title: "",
      description: "",
      snippet: "",
      isVisible: (state: AppState): boolean => {
        // TODO
        return false;
      },
    },
    isComplete: (state: AppState): boolean => {
      // TODO
      return false;
    },
  },
];
