import { cn } from "@/libs/utils/cn";
import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import AsyncSelect from "react-select/async";

function FakeReactSelect({
  placeholder = "Select...",
  ...props
}: Parameters<Select>[0] | Parameters<AsyncSelect>[0]) {
  return (
    <>
      <div
        className={cn(
          "flex h-[38px] w-full rounded-[4px] border-[1px] border-[#cccccc] bg-white",
          props.className,
        )}
      >
        <p className="flex w-full items-center overflow-x-clip px-[10px] py-[2px] text-[#808080]">
          {placeholder}
        </p>
        <div className="my-2 w-[1px] bg-[#cccccc]"></div>
        <div className="flex aspect-square items-center justify-center p-2">
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path
              fill="#cccccc"
              d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
            ></path>
          </svg>
        </div>
      </div>
    </>
  );
}

function useClient() {
  const [isClient, setClient] = useState<boolean>(false);
  useEffect(() => {
    setClient(true);
  }, []);
  return isClient;
}

export function ReactSelect({
  className,
  ...props
}: Parameters<Select>[0]) {
  return (
    <>
      <Select
        {...props}
        instanceId={`react-select-${props.name}`}
        className={cn("w-full", className)}
        closeMenuOnSelect={props.isMulti ? false : true}
        menuPlacement="auto"
        components={{
          Input: (props) => (
            <components.Input {...props} aria-activedescendant={undefined} />
          ),
        }}
      />
    </>
  );
}

export function ReactAsyncSelect({
  className,
  ...props
}: Parameters<AsyncSelect>[0]) {
  return (
    <>
      <AsyncSelect
        instanceId={`react-asyncSelect-${props.name}`}
        {...props}
        cacheOptions
        defaultOptions
        className={cn("w-full", className)}
        closeMenuOnSelect={props.isMulti ? false : true}
        menuPosition="fixed"
        components={{
          Input: (props) => (
            <components.Input {...props} aria-activedescendant={undefined} />
          ),
        }}
      />
    </>
  );
}
