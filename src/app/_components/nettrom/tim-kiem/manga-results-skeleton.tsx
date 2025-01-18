export default function MangaResultsSkeleton() {
  return (
    <div className="Module Module-223" id="results">
      <div className="ModuleContent">
        <div className="items">
          <div className="row">
            {[...Array(24)].map((_, index) => (
              <div className="item" key={index}>
                <figure className="clearfix">
                  <div className="image">
                    <div className="h-[240px] w-full animate-pulse bg-gray-200 dark:bg-gray-700" />
                    <div className="view clearfix">
                      <span className="pull-left space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <span key={i} className="inline-block">
                            <i className="fa fa-star mr-1" />
                            <span className="inline-block h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                  <figcaption>
                    <h3>
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    </h3>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
