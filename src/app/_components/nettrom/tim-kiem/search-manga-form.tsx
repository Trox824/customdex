"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select, { StylesConfig } from "react-select";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";

import { Skeleton } from "~/app/_components/shadcn/skeleton";
import { MangadexApi } from "~/api";
import { Tag } from "~/app/_components/types/mangadex";
import { Utils } from "~/app/_components/utils";
import { Constants } from "~/app/constants";

/** -----------------------------
 *  TYPES & CONSTANTS
 *  -----------------------------
 */

type Inputs = MangadexApi.Manga.GetSearchMangaRequestOptions & {
  orderType?: string;
};

interface SearchState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Helper function to create React-Select options
 */
const createOption = (
  t: string,
  parser: (val: string) => string = (val) => val.toUpperCase(),
) => ({
  value: t,
  label: parser(t),
});

const optionlize = (
  t: string,
  parser: (t: string) => string = (t) => t.toUpperCase(),
) => ({ value: t, label: parser(t) });

/**
 * Custom styles for react-select
 */
const selectStyles: StylesConfig<{ value: string; label: string }, true> = {
  control: (base: any) => ({
    ...base,
    // add or tweak desired styling here
    minHeight: "2.5rem",
    borderColor: "#ccc",
  }),
  option: (base: any) => ({
    ...base,
    color: "#333",
  }),
};

/**
 * Add these SVG icons near your other constants
 */
const ICONS = {
  chevronDown: (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  ),
  chevronUp: (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ),
  included: (
    <svg
      className="h-4 w-4 text-green-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  excluded: (
    <svg
      className="h-4 w-4 text-red-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  none: (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      />
    </svg>
  ),
};

/** -----------------------------
 *  COMPONENTS
 *  -----------------------------
 */

/**
 * Renders a single tag item with its current state (include, exclude, or none).
 */
function TagItem({
  tag,
  state,
  onClick,
}: {
  tag: Tag;
  state: number;
  onClick: (tag: Tag) => void;
}) {
  return (
    <div
      className="tag-item cursor-pointer rounded border p-2 hover:bg-gray-100"
      onClick={() => onClick(tag)}
    >
      <div
        className="flex items-center gap-2"
        title={tag.attributes.description.en}
      >
        <span className={`tag-state-${state}`} />
        <span className="truncate">{tag.attributes.name.en}</span>
      </div>
    </div>
  );
}

/** -----------------------------
 *  MAIN SEARCH FORM
 *  -----------------------------
 */
export default function SearchMangaForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isTagsVisible, setIsTagsVisible] = useState(true);

  const { register, handleSubmit, watch, reset, setValue, control } =
    useForm<Inputs>({});
  const formValues = watch();

  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    error: null,
  });
  const onSubmit: SubmitHandler<Inputs> = (data: any) => {
    router.push(Utils.Url.getSearchNetTromUrl(data));
  };
  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        setValue("title", searchTerm);

        if (searchTerm.length >= 2) {
          setSearchState((prev) => ({ ...prev, isLoading: true }));
          router.push(
            Utils.Url.getSearchNetTromUrl({
              ...formValues,
              title: searchTerm,
            }),
          );
        }
      }, 500),
    [router, setValue, formValues],
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  /**
   * Tag logic: 1 = included, 0 = none, -1 = excluded
   */
  const getTagState = (tag: Tag) => {
    if (formValues.includedTags?.includes(tag.id)) return 1;
    if (formValues.excludedTags?.includes(tag.id)) return -1;
    return 0;
  };

  const toggleTagState = (tag: Tag) => {
    const currentState = getTagState(tag);

    if (currentState === 1) {
      // from included -> excluded
      setValue(
        "includedTags",
        formValues.includedTags?.filter((id) => id !== tag.id) || [],
      );
      setValue("excludedTags", [...(formValues.excludedTags || []), tag.id]);
    } else if (currentState === 0) {
      // from none -> included
      setValue("includedTags", [...(formValues.includedTags || []), tag.id]);
    } else {
      // from excluded -> none
      setValue(
        "excludedTags",
        formValues.excludedTags?.filter((id) => id !== tag.id) || [],
      );
    }
  };

  const getCheckboxIcon = (s: number) => {
    switch (s) {
      case 1:
        return ICONS.included;
      case -1:
        return ICONS.excluded;
      default:
        return ICONS.none;
    }
  };

  /**
   * Populate form from URL params on first render or param changes
   */
  useEffect(() => {
    const normalizedParams: Inputs = params
      ? Utils.Mangadex.normalizeParams(params)
      : {};

    // If 'orderType' not set but 'order' is present, figure out which select option to check
    if (!params?.get("orderType") && normalizedParams.order) {
      if (
        normalizedParams.order.latestUploadedChapter ===
        MangadexApi.Static.Order.DESC
      )
        normalizedParams.orderType = "0";
      else if (
        normalizedParams.order.createdAt === MangadexApi.Static.Order.DESC
      )
        normalizedParams.orderType = "1";
      else if (
        normalizedParams.order.followedCount === MangadexApi.Static.Order.DESC
      )
        normalizedParams.orderType = "2";
      else if (normalizedParams.order.title === MangadexApi.Static.Order.ASC)
        normalizedParams.orderType = "3";
      else if (
        normalizedParams.order.relevance === MangadexApi.Static.Order.DESC
      )
        normalizedParams.orderType = "4";
      else if (normalizedParams.order.rating === MangadexApi.Static.Order.DESC)
        normalizedParams.orderType = "5";
    }
    reset({ ...normalizedParams });
  }, [params, reset]);

  /**
   * Update "order" object whenever "orderType" changes
   */
  useEffect(() => {
    switch (formValues.orderType) {
      case "0":
        setValue("order", {
          latestUploadedChapter: MangadexApi.Static.Order.DESC,
        });
        break;
      case "1":
        setValue("order", { createdAt: MangadexApi.Static.Order.DESC });
        break;
      case "2":
        setValue("order", { followedCount: MangadexApi.Static.Order.DESC });
        break;
      case "3":
        setValue("order", { title: MangadexApi.Static.Order.ASC });
        break;
      case "4":
        setValue("order", { relevance: MangadexApi.Static.Order.DESC });
        break;
      case "5":
        setValue("order", { rating: MangadexApi.Static.Order.DESC });
        break;
      default:
        break;
    }
  }, [formValues.orderType, setValue]);

  // Add this function to handle reset
  const handleReset = () => {
    reset(); // Reset the form to its initial state
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="advsearch-form">
      {/* Search Title Input */}

      {/* Main Filters Grid */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Content Rating */}
        <div className="form-group">
          <label className="form-label">Sếch??</label>
          {searchState.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Controller
              control={control}
              name="contentRating"
              render={({ field }) => (
                <Select
                  options={Object.values(
                    MangadexApi.Static.MangaContentRating,
                  ).map((v) =>
                    optionlize(v, Utils.Mangadex.translateContentRating),
                  )}
                  onChange={(selected) => {
                    field.onChange(selected ? [selected.values] : []);
                  }}
                  value={
                    field.value?.[0]
                      ? optionlize(
                          field.value[0],
                          Utils.Mangadex.translateContentRating,
                        )
                      : null
                  }
                  isMulti
                  placeholder="Tất cả"
                  styles={selectStyles}
                />
              )}
            />
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">Tình trạng</label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                {...field}
                options={Object.values(
                  MangadexApi.Static.MangaPublicationStatus,
                ).map((val) =>
                  createOption(val, Utils.Mangadex.translateStatus),
                )}
                onChange={(selected) => {
                  field.onChange(selected?.map((item) => item.value));
                }}
                value={field.value?.map((v) =>
                  createOption(v, Utils.Mangadex.translateStatus),
                )}
                isMulti
                placeholder="Tất cả"
                styles={selectStyles}
              />
            )}
          />
        </div>

        {/* Order By */}
        <div className="form-group">
          <label className="form-label">Sắp xếp theo</label>
          <Controller
            control={control}
            name="orderType"
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: "0", label: "Mới cập nhật" },
                  { value: "1", label: "Truyện mới" },
                  { value: "2", label: "Theo dõi nhiều nhất" },
                  { value: "3", label: "Bảng chữ cái" },
                  { value: "4", label: "Liên quan nhất" },
                  { value: "5", label: "Đánh giá cao nhất" },
                ]}
                onChange={(selected) => field.onChange(selected?.values)}
                value={
                  field.value
                    ? {
                        value: field.value,
                        label:
                          field.value === "0"
                            ? "Mới cập nhật"
                            : field.value === "1"
                              ? "Truyện mới"
                              : field.value === "2"
                                ? "Theo dõi nhiều nhất"
                                : field.value === "3"
                                  ? "Bảng chữ cái"
                                  : field.value === "4"
                                    ? "Liên quan nhất"
                                    : "Đánh giá cao nhất",
                      }
                    : null
                }
                placeholder="Chọn cách sắp xếp"
                styles={selectStyles}
              />
            )}
          />
        </div>
      </div>

      {/* Collapsible Tags Section */}
      <div className="form-group">
        <div
          className="mb-4 flex cursor-pointer select-none items-center gap-2"
          onClick={() => setIsTagsVisible(!isTagsVisible)}
        >
          <label className="text-2xl font-medium">Thể loại</label>
          {isTagsVisible ? ICONS.chevronUp : ICONS.chevronDown}
        </div>

        {isTagsVisible && (
          <div className="grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-6">
            {Constants.Nettrom.tags.map((tag) => {
              const state = getTagState(tag);
              return (
                <div
                  key={tag.id}
                  onClick={() => toggleTagState(tag)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100"
                  title={tag.attributes.description.en}
                >
                  {getCheckboxIcon(state)}
                  <span className="text-xl">{tag.attributes.name.en}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Search Button */}
      <div className="m-4 flex justify-center gap-4">
        <button type="submit" className="btn btn-success px-8">
          Tìm kiếm
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary bg-blue-500 px-8 text-white"
          onClick={handleReset}
        >
          <i className="fa fa-refresh" /> Reset
        </button>
      </div>

      {searchState.error && (
        <div className="alert alert-danger mt-3">{searchState.error}</div>
      )}
    </form>
  );
}
