import { promises as fs } from "fs"
import grayMatter from "gray-matter"
import Head from "next/head"
import path from "path"
import { useState } from "react"
import PostPreview from "../components/blog/blog.preview"
import Footer from "../components/footer/footer.main"
import GlobalLayout from "../components/global/global.layout"
import GlobalSearch from "../components/global/global.search"

export default function Blog({ allPosts }) {
  const morePosts = allPosts
  const emptyQuery = ""
  const [filteredPosts, setFilteredPosts] = useState({
    filteredData: [],
    query: emptyQuery,
  })

  const handleInputChange = (event) => {
    event.preventDefault()
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
  const posts = hasSearchResults ? filteredData : morePosts
  return (
    <GlobalLayout>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1
        className="
    text-secondaryLink
    font-semibold
    text-5xl
    mb:px-3
    xfl:px-3
    lpt:px-3"
      >
        Blog
      </h1>
      <GlobalSearch
        onSubmit={(event) => event.preventDefault()}
        value={query}
        onChange={handleInputChange}
        submitStyle={{ display: "none" }}
      />
      <ul className="list-none mb-1 grid justify-items-center">
        {posts.map((post, index) => {
          const { title, path, date, tags, excerpt } = post
          const tagList = tags.map((tag) => (
            <li
              className="text-label smp:px-3 sm:px-6 smp:my-2 smp:mx-4 py-2 bg-link"
              key={Math.random()}
            >
              {tag}
            </li>
          ))
          return (
            <PostPreview
              key={index}
              title={title}
              path={path}
              date={date}
              tags={tagList}
              excerpt={excerpt}
            />
          )
        })}
      </ul>
      <div className="mt-2 h-0.5 bg-input px-3" />

      <Footer />
    </GlobalLayout>
  )
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "pages/blog")
  const filenames = await fs.readdir(postsDirectory)

  const files = await Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.join(postsDirectory, filename)
      const content = await fs.readFile(filePath, "utf8")
      const matter = grayMatter(content)
      return {
        filename,
        matter,
      }
    })
  )

  const allPosts = files.map((file) => {
    return {
      path: `/blog/${file.filename.replace(".mdx", "")}`,
      title: file.matter.data.title,
      date: file.matter.data.date,
      image: file.matter.data.coverImage,
      excerpt: file.matter.data.excerpt,
      tags: file.matter.data.tags,
    }
  })
  const sortByDate = (a, b) => {
    return new Date(b.date) - new Date(a.date)
  }
  return {
    props: {
      allPosts: allPosts.sort(sortByDate),
    },
  }
}
