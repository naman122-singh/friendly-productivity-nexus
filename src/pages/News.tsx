
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
}

const categories = [
  "technology",
  "business",
  "health",
  "science",
  "entertainment",
  "sports",
];

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock news data for demonstration
    const mockArticles: NewsArticle[] = [
      {
        id: "1",
        title: "New AI Model Achieves Breakthrough in Natural Language Understanding",
        description: "Researchers have developed a new AI model that demonstrates unprecedented capabilities in understanding and generating human language, potentially revolutionizing how we interact with technology.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1677442719798-e5c919a5fa3b",
        publishedAt: "2025-05-16T14:32:00Z",
        source: {
          name: "Tech Innovations"
        },
        category: "technology"
      },
      {
        id: "2",
        title: "Global Markets React to Central Bank Policy Shift",
        description: "Stock markets worldwide showed volatility as major central banks signaled a potential change in monetary policy, with investors reassessing their positions in anticipation of changing interest rates.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
        publishedAt: "2025-05-17T08:45:00Z",
        source: {
          name: "Financial Times"
        },
        category: "business"
      },
      {
        id: "3",
        title: "New Study Reveals Benefits of Intermittent Exercise",
        description: "Researchers have found that short bursts of exercise throughout the day may provide comparable health benefits to longer workout sessions, offering new options for those with busy schedules.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e",
        publishedAt: "2025-05-16T11:20:00Z",
        source: {
          name: "Health Today"
        },
        category: "health"
      },
      {
        id: "4",
        title: "Astronomers Discover Potentially Habitable Exoplanet",
        description: "A team of astronomers has identified a new exoplanet within the habitable zone of its star, showing promising signs of conditions that could potentially support life.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
        publishedAt: "2025-05-15T16:10:00Z",
        source: {
          name: "Science Daily"
        },
        category: "science"
      },
      {
        id: "5",
        title: "Award-Winning Director Announces Groundbreaking Virtual Reality Film",
        description: "A renowned filmmaker has revealed plans for an innovative project that will blend traditional cinema with virtual reality technology, creating an immersive narrative experience.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
        publishedAt: "2025-05-17T09:15:00Z",
        source: {
          name: "Entertainment Weekly"
        },
        category: "entertainment"
      },
      {
        id: "6",
        title: "Major Upset in International Tennis Tournament",
        description: "An unexpected outcome in yesterday's championship match has surprised fans and analysts alike, potentially reshaping the rankings as the season progresses.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1579355456684-f33b9f32e5c6",
        publishedAt: "2025-05-16T22:05:00Z",
        source: {
          name: "Sports Network"
        },
        category: "sports"
      }
    ];
    
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 1000);
  }, []);
  
  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getArticlesByCategory = (category: string) => {
    return articles.filter(article => article.category === category);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">News</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardHeader>
                    <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-1/4 bg-muted animate-pulse rounded mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden h-full flex flex-col">
                  <div className="h-48 bg-muted overflow-hidden">
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <CardDescription>
                      {article.source.name} • {formatPublishedDate(article.publishedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full" asChild>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        Read Full Article
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-muted animate-pulse" />
                    <CardHeader>
                      <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-1/4 bg-muted animate-pulse rounded mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
                      <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
                      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getArticlesByCategory(category).length > 0 ? (
                  getArticlesByCategory(category).map((article) => (
                    <Card key={article.id} className="overflow-hidden h-full flex flex-col">
                      <div className="h-48 bg-muted overflow-hidden">
                        {article.urlToImage && (
                          <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                        <CardDescription>
                          {article.source.name} • {formatPublishedDate(article.publishedAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {article.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button variant="outline" className="w-full" asChild>
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            Read Full Article
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-lg font-medium">No articles found</h3>
                    <p className="text-muted-foreground">
                      No articles available in this category. Please check back later.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default News;
