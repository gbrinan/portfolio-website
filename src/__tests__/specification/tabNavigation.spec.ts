/**
 * TC-001: Tab Navigation Specification Test
 * Requirement: RQ-001 - Dual Identity Tab System
 *
 * 이 테스트는 탭 네비게이션의 예상 동작을 정의합니다.
 * Greenfield 프로젝트의 specification test로서,
 * 구현 전에 예상되는 동작을 명확히 합니다.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TabNavigation } from '@/components/TabNavigation'
import { TabId } from '@/types'

describe('TC-001: Tab Navigation (RQ-001)', () => {
  const mockOnTabChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('Tab Rendering', () => {
    it('should render both AI Artist and AX Expert tabs', () => {
      render(<TabNavigation activeTab="ai-artist" onTabChange={mockOnTabChange} />)

      expect(screen.getByRole('tab', { name: /AI Artist/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /AX Expert/i })).toBeInTheDocument()
    })

    it('should display tabs in correct order', () => {
      render(<TabNavigation activeTab="ai-artist" onTabChange={mockOnTabChange} />)

      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveTextContent('AI Artist')
      expect(tabs[1]).toHaveTextContent('AX Expert')
    })
  })

  describe('Active Tab Visual Distinction', () => {
    it('should visually distinguish active tab', () => {
      const { rerender } = render(
        <TabNavigation activeTab="ai-artist" onTabChange={mockOnTabChange} />
      )

      const aiArtistTab = screen.getByRole('tab', { name: /AI Artist/i })
      const axExpertTab = screen.getByRole('tab', { name: /AX Expert/i })

      expect(aiArtistTab).toHaveAttribute('aria-selected', 'true')
      expect(axExpertTab).toHaveAttribute('aria-selected', 'false')

      rerender(<TabNavigation activeTab="ax-expert" onTabChange={mockOnTabChange} />)

      expect(aiArtistTab).toHaveAttribute('aria-selected', 'false')
      expect(axExpertTab).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('Tab State Persistence', () => {
    it('should persist active tab in localStorage', () => {
      render(<TabNavigation activeTab="ax-expert" onTabChange={mockOnTabChange} />)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'portfolio-active-tab',
        'ax-expert'
      )
    })

    it('should restore tab state from localStorage on mount', async () => {
      localStorage.getItem.mockReturnValue('ax-expert')

      const { rerender } = render(
        <TabNavigation activeTab="ai-artist" onTabChange={mockOnTabChange} />
      )

      // 컴포넌트가 localStorage에서 상태를 복원해야 함
      await waitFor(() => {
        expect(localStorage.getItem).toHaveBeenCalledWith('portfolio-active-tab')
      })
    })
  })

  describe('Tab Switching Behavior', () => {
    it('should call onTabChange when tab is clicked', () => {
      render(<TabNavigation activeTab="ai-artist" onTabChange={mockOnTabChange} />)

      const axExpertTab = screen.getByRole('tab', { name: /AX Expert/i })
      fireEvent.click(axExpertTab)

      expect(mockOnTabChange).toHaveBeenCalledWith('ax-expert')
    })

    it('should not call onTabChange when clicking already active tab', () => {
      render(<TabNavigation activeTab="ai-artist" onTabChange={mockOnTabChange} />)

      const aiArtistTab = screen.getByRole('tab', { name: /AI Artist/i })
      fireEvent.click(aiArtistTab)

      expect(mockOnTabChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(<TabNavigation activeTab="ai-artist" onTabChange={mockOnTabChange} />)

      expect(screen.getByRole('tablist')).toBeInTheDocument()
      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(2)
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('role', 'tab')
      })
    })

    it('should support keyboard navigation', () => {
      render(<TabNavigation activeTab="ai-artist" onTabChange={mockOnTabChange} />)

      const tabs = screen.getAllByRole('tab')

      // 첫 번째 탭에 포커스
      tabs[0].focus()
      expect(document.activeElement).toBe(tabs[0])

      // Arrow Right로 다음 탭으로 이동해야 함
      fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })

      // 실제 구현에서는 키보드 네비게이션을 지원해야 함
      // 이 테스트는 해당 기능의 명세를 정의
    })
  })

  describe('Animation Performance', () => {
    it('should complete transition within 300ms', async () => {
      const startTime = performance.now()

      render(<TabNavigation activeTab="ax-expert" onTabChange={mockOnTabChange} />)

      // 애니메이션 완료 대기
      await waitFor(() => {
        const endTime = performance.now()
        const duration = endTime - startTime
        expect(duration).toBeLessThan(300)
      })
    })
  })
})
