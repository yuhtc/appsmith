import React from "react";
import _ from "lodash";
import { WidgetProps } from "./BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import ContainerWidget from "widgets/ContainerWidget";
import { ContainerComponentProps } from "components/designSystems/appsmith/ContainerComponent";
import shallowEqual from "shallowequal";
import * as Sentry from "@sentry/react";
import withMeta from "./MetaHOC";
import { DependantPropertyTriggersMap } from "../utils/WidgetFactory";

class FormWidget extends ContainerWidget {
  static getDependantPropertyTriggersMap(): DependantPropertyTriggersMap {
    return {
      children: (widgetProps, updateWidget) => {
        const formData: any = {};
        if (widgetProps.children) {
          widgetProps.children.forEach((widgetData: WidgetProps) => {
            if (widgetData.value) {
              formData[widgetData.widgetName] = widgetData.value;
            }
          });
        }
        if (!shallowEqual(formData, widgetProps.data)) {
          updateWidget({
            ...widgetProps,
            data: formData,
          });
        }
      },
    };
  }

  checkInvalidChildren = (children: WidgetProps[]): boolean => {
    return _.some(children, child => {
      if ("children" in child) {
        return this.checkInvalidChildren(child.children);
      }
      if ("isValid" in child) {
        return !child.isValid;
      }
      return false;
    });
  };

  handleResetInputs = () => {
    super.resetChildrenMetaProperty(this.props.widgetId);
  };

  renderChildWidget(childWidgetData: WidgetProps): React.ReactNode {
    if (childWidgetData.children) {
      const isInvalid = this.checkInvalidChildren(childWidgetData.children);
      childWidgetData.children.forEach((grandChild: WidgetProps) => {
        if (isInvalid) grandChild.isFormValid = false;
        // Add submit and reset handlers
        grandChild.onReset = this.handleResetInputs;
      });
    }
    return super.renderChildWidget(childWidgetData);
  }

  getWidgetType(): WidgetType {
    return "FORM_WIDGET";
  }
}

export interface FormWidgetProps extends ContainerComponentProps {
  name: string;
  data: Record<string, unknown>;
}

export default FormWidget;
export const ProfiledFormWidget = Sentry.withProfiler(withMeta(FormWidget));
