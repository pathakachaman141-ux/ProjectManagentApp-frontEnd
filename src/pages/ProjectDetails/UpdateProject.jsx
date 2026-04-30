import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/Button'
import { Input } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import { Label } from '@/Components/ui/Label'
import { Badge } from '@/Components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { X, Plus, ArrowLeft, Save, Loader2 } from 'lucide-react'
import { fetchProjectById, updateProject } from '../../Redux/Project/Action'
import { toast } from 'react-hot-toast'

const availableTags = [
  "react", "nextjs", "spring boot", "mysql", "mongodb", 
  "angular", "python", "flask", "django", "nodejs", 
  "express", "vue", "typescript", "javascript", "java"
];

const UpdateProject = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projectDetails, loading, error } = useSelector(store => store.project)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: []
  })
  
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch project details on component mount
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId))
    }
  }, [dispatch, projectId])

  // Update form data when project details are loaded
  useEffect(() => {
    if (projectDetails) {
      setFormData({
        name: projectDetails.name || '',
        description: projectDetails.description || '',
        category: projectDetails.category || '',
        tags: projectDetails.tags || []
      })
    }
  }, [projectDetails])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
  }

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddCustomTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim().toLowerCase())
      setNewTag('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCustomTag()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return
    }
    
    if (!formData.category) {
      toast.error('Please select a category')
      return
    }

    setIsSubmitting(true)
    
    try {
      await dispatch(updateProject(projectId, formData))
      toast.success('Project updated successfully!')
      navigate(`/`)
    } catch (error) {
      toast.error('Failed to update project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/project/${projectId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading project details...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4 ">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Project</h2>
          <p>{error}</p>
        </div>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 ">
        <div className="flex items-center space-x-4 ">
          <Button 
            onClick={() => navigate(`/`)} 
            variant="ghost" 
            size="sm"
            className='bg-white'
          >
            <ArrowLeft className="h-4 w-4 mr-2 bg-white" />
            Back to Project
          </Button>
          <h1 className="text-2xl font-bold">Update Project</h1>
        </div>
      </div>

      {/* Form */}
      <Card className='bg-[#7BB3E8]'>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 ">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
                className='bg-white'
              />
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
                rows={4}
                className='bg-white'
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className='bg-white'>
                  <SelectValue className='bg-white' placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="fullstack">Full Stack</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="ai/ml">AI/ML</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              
              {/* Current Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Custom Tag */}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add custom tag"
                  className="flex-1 bg-white"
                />
                <Button 
                  type="button" 
                  onClick={handleAddCustomTag}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Suggested Tags */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Suggested Tags:</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter(tag => !formData.tags.includes(tag))
                    .map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="cursor-pointer bg-[#C49A7F] hover:bg-gray-100"
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                        <Plus className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Project
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UpdateProject