import { useState } from "react"
import { getAllPosts } from "../components/blog/blog.api"
import PostPreview from "../components/blog/blog.preview"
import GlobalLayout from "../components/global/global.layout"

const Blog = ({ allPosts }) => {
  const morePosts = allPosts
  const emptyQuery = ""
  const [filteredPosts, setFilteredPosts] = useState({
    filteredData: [],
    query: emptyQuery,
  })

  const handleInputChange = (event) => {
    const query = event.target.value
    const posts = morePosts || []
    const filteredData = posts.filter((post) => {
      const { title, tags } = post
      return (
        title.toLowerCase().includes(query.toLowerCase()) ||
        tags.join("").toLowerCase().includes(query.toLowerCase())
      )
    })

    setFilteredPosts({
      query,
      filteredData,
    })
  }
  const { filteredData, query } = filteredPosts
  const hasSearchResults = filteredData && query !== emptyQuery
  const posts = hasSearchResults ? filteredData : allPosts
  return (
    <GlobalLayout>
      <>
        <ul
          className="blog text-white list-none flex flex-row flex-wrap justify-around"
          key="me"
        >
          {posts &&
            posts.map(({ tags, title, date, excerpt, coverImage, slug }) => {
              const tagList = tags.map((tag) => (
                <p className="pr-2 text-danger">{tag}</p>
              ))
              return (
                <PostPreview
                  tags={tagList}
                  key={title}
                  title={title}
                  date={date}
                  excerpt={excerpt}
                  coverImage={coverImage}
                  slug={slug}
                />
              )
            })}
        </ul>
      </>
    </GlobalLayout>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
    "tags",
  ])

  return {
    props: { allPosts },
  }
}

export default Blog
