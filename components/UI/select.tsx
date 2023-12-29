import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import SelectType from "react-select";
import AsyncSelectType from "react-select/async";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <FakeReactSelect />,
});
const AsyncSelect = dynamic(() => import("react-select/async"), {
  ssr: false,
  loading: () => <FakeReactSelect />,
});

function FakeReactSelect({
  placeholder = "Select...",
}: {
  placeholder?: string;
}) {
  return (
    <>
      <div className="flex h-[38px] w-full rounded-[4px] border-[1px] border-[#cccccc]">
        <p className="flex w-full items-center px-[10px] py-[2px] text-[#808080]">
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

export function ReactSelect(props: Parameters<SelectType>[0]) {
  const isClient = useClient();
  return (
    <>
      {isClient ? (
        <Select
          {...props}
          className="w-full"
          closeMenuOnSelect={props.isMulti ? false : true}
          // menuPosition="fixed"
        />
      ) : (
        <FakeReactSelect />
      )}
    </>
  );
}

export function ReactAsyncSelect(props: Parameters<AsyncSelectType>[0]) {
  const isClient = useClient();

  return (
    <>
      {isClient ? (
        <AsyncSelect
          {...props}
          cacheOptions
          defaultOptions
          className="w-full"
          closeMenuOnSelect={false}
          menuPosition="fixed"
        />
      ) : (
        <FakeReactSelect />
      )}
    </>
  );
}
